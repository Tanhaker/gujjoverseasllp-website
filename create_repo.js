const token = "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";

async function main() {
  try {
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await userRes.json();
    if (!user.login) {
      console.error("Failed to authenticate:", user);
      return;
    }
    console.log("Authenticated as:", user.login);

    const repoRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'gujjoverseasllp-website',
        private: true,
        description: 'GujjOverseas LLP Official Website'
      })
    });
    
    const repo = await repoRes.json();
    if (repo.clone_url) {
      console.log("SUCCESS_REPO_URL=" + repo.clone_url);
    } else {
      console.error("Failed to create repo:", repo);
    }
  } catch (err) {
    console.error(err);
  }
}
main();
