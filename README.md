This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
First, install the packages:
```bash
npm i
```

Secondly, Create a .env file in the root of the project and Put the following
```bash
NEXT_PUBLIC_BACKEND_API="http://localhost:3001"
```

## Google Firestore
As we are using Google Firestore for real-time chat messaging, there are some configurations needed. The project already has a configuration by our group but the below is to show how you can set it up yourself

### Prerequisites
- Firebase CLI: 
```
npm install -g firebase-tools
```
- Firebase Web SDK:
```
npm i firebase
```

### Create a Project
- Select your project or create a new one
- In Project Settings → General, scroll to Your apps
- Click </> (Web App) to register your app
- Copy the Firebase config snippet:
```
// Example:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdefg12345",
};
```

Create a file at lib/firebase.ts:
```ts
// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

Add your Firebase keys to your .env.local:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Firestore Rules (For Testing)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow reading/writing user's own profile (if needed)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Chat document permissions
    match /chats/{chatId} {
      allow read, write: if request.auth != null;

      // Messages inside each chat
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }

    // Conversations fallback (if you're using a `conversations` collection somewhere)
    match /conversations/{convoId} {
      allow read, write: if request.auth != null;

      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```
## Deployment
Lastly, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
