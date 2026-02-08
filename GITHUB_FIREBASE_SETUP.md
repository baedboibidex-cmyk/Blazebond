# Connecting BlazeBond (GitHub) to Firebase Hosting 🚀

Follow these steps to deploy your BlazeBond app to Firebase Hosting and set up automatic deployments via GitHub Actions.

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add Project** and name it `blazebond` (or any name you prefer).
3. Disable Google Analytics (optional).
4. Click **Create Project**.

## 2. Install Firebase CLI
If you haven't already, install the Firebase CLI on your local machine:
```bash
npm install -g firebase-tools
```

## 3. Initialize Firebase in your local repo
1. Run `firebase login` and authenticate with your Google account.
2. Run `firebase init hosting`.
3. Select **Use an existing project** and choose the project you created in Step 1.
4. When asked about your public directory, type `.` (since your files are in the root).
5. Configure as a single-page app? **Yes**.
6. Set up automatic builds and deploys with GitHub? **Yes**.
7. Firebase will ask you to authorize GitHub. Once done, it will ask for your repository name (e.g., `your-username/BlazeBond`).
8. Select **Yes** to "Set up a workflow to run a build script before every deploy".
9. For the build script, just leave it blank or press enter (this project has no build step).
10. Select **Yes** to "Set up a workflow to automatically deploy to your site's live channel when a PR is merged".

## 4. GitHub Secrets
Firebase will automatically add a secret called `FIREBASE_SERVICE_ACCOUNT_BLAZEBOND_XXXXX` to your GitHub repository. You can verify this in your GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions**.

## 5. Deployment
Now, every time you push to the `main` branch, GitHub Actions will automatically deploy your changes to Firebase Hosting!

### Manual Deployment
If you want to deploy manually at any time, run:
```bash
firebase deploy --only hosting
```

## Note on Mock Auth
Remember that this app currently uses **Mock Authentication** (in `firebase.js`). If you want to switch to real Firebase Auth:
1. Go to Firebase Console -> **Authentication** -> **Get Started**.
2. Enable **Email/Password**.
3. Go to Project Settings -> **General** -> **Your apps** -> **Add app (Web)**.
4. Copy the `firebaseConfig` object and replace the mock implementation in `firebase.js` with the real initialization code.
