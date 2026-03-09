// frontend/src/App.js

// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import './index.css';

// Amplify UI hook for signOut and user info
import { useAuthenticator } from '@aws-amplify/ui-react';

// Amplify Data client (Gen 2)
import { generateClient } from 'aws-amplify/data';
const client = generateClient();

function App() {
  const { signOut, user } = useAuthenticator();  // <-- adds signOut + user
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        setLoading(true);

        // Use userPool auth from the browser
        const { data, errors } = await client.models.UserProfile.list({
          authMode: 'userPool',
        });

        if (errors?.length) {
          throw new Error(errors.map(e => e.message).join('; '));
        }

        const first = data?.[0];
        if (!cancelled) {
          setEmail(first?.email ?? '(no email found)');
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message ?? String(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="card">
      {/* Small header row with user id and a Sign out button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Profiles App</h1>
        <div>
          {user?.signInDetails?.loginId && (
            <span style={{ marginRight: 12 }}>Signed in as: {user.signInDetails.loginId}</span>
          )}
          <button onClick={signOut}>Sign out</button>
        </div>
      </div>

      {loading && <p>Loading your profile…</p>}

      {!loading && errorMsg && (
        <p style={{ color: 'salmon' }}>
          Error loading profile: {errorMsg}
        </p>
      )}

      {!loading && !errorMsg && (
        <>
          <p>You are signed in.</p>
          <p><strong>Email:</strong> {email}</p>
        </>
      )}

      <p className="read-the-docs">
        Powered by Amplify Auth + Data.
      </p>
    </div>
  );
}

export default App;