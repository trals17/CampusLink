export async function getGitHubAccessToken(code: string) {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  const accessTokenResponse = await fetch(accessTokenURL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });

  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    throw new Error('Error retrieving access token');
  }

  return access_token;
}

export async function getGitHubUserProfile(accessToken: string) {
  const userProfileResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-cache',
  });

  return userProfileResponse.json();
}

export async function getGitHubUserEmail(accessToken: string) {
  const userEmailResponse = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-cache',
  });

  return userEmailResponse.json();
}
