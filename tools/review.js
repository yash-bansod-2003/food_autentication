import { execSync } from "child_process"
import { Octokit } from "octokit"
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv"

dotenv.config();
async function getChangedFiles() {
  const baseSha = execSync("git merge-base origin/main HEAD").toString().trim();
  const diffOutput = execSync(`git diff --name-only ${baseSha}`).toString();
  return diffOutput.split("\n").filter(file => file.trim());
}

async function analyzeCodeWithGemini(fileContent) {
  const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  You are an expert code reviewer for a TypeScript, Express.js, and Node.js project. Please provide a detailed code review for the following code snippet. 
  
  For your review, consider the following aspects:
  1. **Code Optimization**: Identify areas where the code can be optimized for performance and efficiency.
  2. **Code Quality**: Suggest improvements to make the code cleaner, more readable, and maintainable.
  3. **Security Issues**: Highlight any potential security vulnerabilities, including but not limited to SQL injection, XSS, authentication, and authorization flaws.
  4. **Best Practices**: Point out areas where coding best practices can be applied, especially with TypeScript, Express.js, and Node.js.
  5. **Potential Bugs**: Identify any logic errors or edge cases that might cause issues in the application.
  
  Here is the code to review:
  ${fileContent}
  `;


  try {
    const result = await model.generateContent(prompt);
    const parsedResult = result.response.candidates[0].content.parts[0].text;
    return parsedResult || "No suggestions were provided.";
  } catch (error) {
    console.error("Error using Gemini AI:", error.message);
    return "Unable to analyze the code.";
  }
}

async function postReviewComment(owner, repo, comment) {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  await octokit.request(`GET /repos/${owner}/${repo}/issues/comments`, {
    owner: owner,
    repo: repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: comment
  })
}

(async function main() {
  const changedFiles = await getChangedFiles();
  if (changedFiles.length === 0) {
    console.log("No changed files to analyze.");
    return;
  }

  const owner = process.env.GITHUB_REPOSITORY.split("/")[0];
  const repo = process.env.GITHUB_REPOSITORY.split("/")[1];

  let reviewComment = "### Code Review Report\n\n";

  for (const file of changedFiles) {
    console.log(`Analyzing file: ${file}`);
    const fileContent = execSync(`cat ${file}`).toString();
    const suggestions = await analyzeCodeWithGemini(fileContent);
    reviewComment += `#### File: ${file}\n${suggestions}\n\n`;
  }

  await postReviewComment(owner, repo, reviewComment);
})();