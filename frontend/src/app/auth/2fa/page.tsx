"use client";

import { useState } from "react";
import { twoFactor } from "@/lib/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function TwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/overview";

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useBackupCode, setUseBackupCode] = useState(false);

  const handleVerify = async () => {
    if (!code) {
      setError("Please enter a code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      if (useBackupCode) {
        const { error: verifyError } = await twoFactor.verifyBackupCode({
          code,
          trustDevice: true,
        });

        if (verifyError) {
          setError(verifyError.message || "Invalid backup code");
          setIsVerifying(false);
          return;
        }
      } else {
        if (code.length !== 6) {
          setError("Please enter a 6-digit code");
          setIsVerifying(false);
          return;
        }

        const { error: verifyError } = await twoFactor.verifyTotp({
          code,
          trustDevice: true,
        });

        if (verifyError) {
          setError(verifyError.message || "Invalid verification code");
          setIsVerifying(false);
          return;
        }
      }

      // Redirect to callback URL
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Two-Factor Authentication
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {useBackupCode
                ? "Enter one of your backup codes"
                : "Enter the 6-digit code from your authenticator app"}
            </p>
          </div>

          {/* Code Input */}
          <div className="space-y-4">
            {useBackupCode ? (
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter backup code"
                className="w-full px-4 py-3 text-center text-lg tracking-wider border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            ) : (
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-4 text-center text-3xl tracking-[0.5em] font-mono border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleVerify}
              disabled={isVerifying || !code}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>

          {/* Toggle Backup Code */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setCode("");
                setError(null);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {useBackupCode ? "Use authenticator code instead" : "Use a backup code instead"}
            </button>
          </div>

          {/* Back to sign in */}
          <div className="mt-4 text-center">
            <Link
              href="/auth"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
