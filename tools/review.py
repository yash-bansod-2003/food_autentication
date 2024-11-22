import subprocess
import os
import requests
from github import Github

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

def get_changed_files():
    base_sha = subprocess.check_output(["git", "merge-base", "origin/main", "HEAD"]).decode().strip()
    diff_output = subprocess.check_output(["git", "diff", "--name-only", base_sha]).decode()
    return [file.strip() for file in diff_output.split("\n") if file.strip()]

def analyze_code_with_gemini(file_content):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${os.getenv('GEMINI_API_KEY')}"
    headers = {
        "Content-Type": "application/json"
    }
    
    prompt = f"""
    You are an expert code reviewer for a TypeScript, Express.js, and Node.js project. Please provide a detailed code review for the following code snippet.

    For your review, consider the following aspects:
    1. **Code Optimization**: Identify areas where the code can be optimized for performance and efficiency.
    2. **Code Quality**: Suggest improvements to make the code cleaner, more readable, and maintainable.
    3. **Security Issues**: Highlight any potential security vulnerabilities, including but not limited to SQL injection, XSS, authentication, and authorization flaws.
    4. **Best Practices**: Point out areas where coding best practices can be applied, especially with TypeScript, Express.js, and Node.js.
    5. **Potential Bugs**: Identify any logic errors or edge cases that might cause issues in the application.

    Here is the code to review:
    {file_content}
    """
    
    data = {
        "contents":[{
          "parts":[
            {"text": prompt},
          ]
        }]
    }
    
    response = requests.post(url, headers=headers, data=data)
    if response.status_code == 200:
        result = response.json()
        return result['choices'][0]['text'] if 'choices' in result else "No suggestions were provided."
    else:
        print("Error using Gemini AI:", response.text)
        return "Unable to analyze the code."

def post_review_comment(pr_number, repo_owner, repo_name, comment):
    github_token = os.getenv("GITHUB_TOKEN")
    g = Github(github_token)
    repo = g.get_repo(f"{repo_owner}/{repo_name}")
    issue = repo.get_pull(pr_number)
    issue.create_issue_comment(comment)

def main():
    changed_files = get_changed_files()
    if not changed_files:
        print("No changed files to analyze.")
        return

    repo_owner, repo_name = os.getenv("GITHUB_REPOSITORY").split("/")
    pr_number = int(os.getenv("PR_NUMBER"))

    review_comment = "### Code Review Report\n\n"
    for file in changed_files:
        print(f"Analyzing file: {file}")
        with open(file, 'r') as f:
            file_content = f.read()
        suggestions = analyze_code_with_gemini(file_content)
        review_comment += f"#### File: {file}\n{suggestions}\n\n"

    post_review_comment(pr_number, repo_owner, repo_name, review_comment)

if __name__ == "__main__":
    main()
