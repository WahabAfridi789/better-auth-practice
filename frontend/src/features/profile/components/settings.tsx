"use client";

import { useState, useEffect } from "react";
import { useSession, twoFactor, signOut, linkSocial, unlinkAccount, listAccounts, authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCode from "react-qr-code";

interface Account {
  id: string;
  providerId: string;
  accountId: string;
}

export function Settings() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Connected Accounts State
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [linkingGoogle, setLinkingGoogle] = useState(false);
  const [unlinkingAccount, setUnlinkingAccount] = useState<string | null>(null);

  // Set Password State (for OAuth users)
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [settingPassword, setSettingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // 2FA State
  const [password, setPassword] = useState("");
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2FA Setup State
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [setupStep, setSetupStep] = useState<"password" | "qr" | "verify" | "backup">("password");

  // Fetch connected accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const result = await listAccounts();
        if (result.data) {
          setAccounts(result.data as Account[]);
        }
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
      } finally {
        setAccountsLoading(false);
      }
    };

    if (session) {
      fetchAccounts();
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const handleLinkGoogle = async () => {
    setLinkingGoogle(true);
    try {
      await linkSocial({
        provider: "google",
        callbackURL: window.location.origin + "/dashboard/profile",
      });
    } catch (err: any) {
      console.error("Failed to link Google:", err);
      setLinkingGoogle(false);
    }
  };

  const handleUnlinkAccount = async (providerId: string) => {
    setUnlinkingAccount(providerId);
    try {
      const result = await unlinkAccount({ providerId });
      if (!result.error) {
        setAccounts(accounts.filter((a) => a.providerId !== providerId));
      }
    } catch (err: any) {
      console.error("Failed to unlink account:", err);
    } finally {
      setUnlinkingAccount(null);
    }
  };

  const handleSetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setSettingPassword(true);
    setPasswordError(null);

    try {
      // Call the backend API to set password
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to set password");
      }

      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmPassword("");

      // Refresh accounts to show credential account
      const result = await listAccounts();
      if (result.data) {
        setAccounts(result.data as Account[]);
      }

      setTimeout(() => {
        setShowSetPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to set password");
    } finally {
      setSettingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsEnabling(true);
    setError(null);

    try {
      const { data, error: enableError } = await twoFactor.enable({
        password,
      });

      if (enableError) {
        setError(enableError.message || "Failed to enable 2FA");
        setIsEnabling(false);
        return;
      }

      if (data?.totpURI) {
        setTotpUri(data.totpURI);
        setBackupCodes(data.backupCodes || []);
        setSetupStep("qr");
      }
    } catch (err: any) {
      setError(err.message || "Failed to enable 2FA");
    } finally {
      setIsEnabling(false);
    }
  };

  const handleVerifyTotp = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setIsEnabling(true);
    setError(null);

    try {
      const { error: verifyError } = await twoFactor.verifyTotp({
        code: verificationCode,
      });

      if (verifyError) {
        setError(verifyError.message || "Invalid verification code");
        setIsEnabling(false);
        return;
      }

      setSetupStep("backup");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to verify code");
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    setIsDisabling(true);
    setError(null);

    try {
      const { error: disableError } = await twoFactor.disable({
        password,
      });

      if (disableError) {
        setError(disableError.message || "Failed to disable 2FA");
        setIsDisabling(false);
        return;
      }

      setShowDisableModal(false);
      setPassword("");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to disable 2FA");
    } finally {
      setIsDisabling(false);
    }
  };

  const closeModal = () => {
    setShowEnableModal(false);
    setShowDisableModal(false);
    setPassword("");
    setVerificationCode("");
    setTotpUri(null);
    setBackupCodes(null);
    setSetupStep("password");
    setError(null);
  };

  const closePasswordModal = () => {
    setShowSetPasswordModal(false);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const copyBackupCodes = () => {
    if (backupCodes) {
      navigator.clipboard.writeText(backupCodes.join("\n"));
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/auth");
    return null;
  }

  const is2FAEnabled = session.user.twoFactorEnabled;
  const hasCredentialAccount = accounts.some((a) => a.providerId === "credential");
  const hasGoogleAccount = accounts.some((a) => a.providerId === "google");
  const canUnlink = accounts.length > 1;

  return (
    <main className="flex flex-col gap-4">



      {/* User Info */}
      <div className=" rounded-xl shadow-sm border  p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
        <div className="flex items-center gap-4">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-16 h-16 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xl font-medium text-gray-900 dark:text-white">{session.user.name}</p>
            <p className="text-gray-500 dark:text-gray-400">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className=" rounded-xl shadow-sm border  p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connected Accounts</h2>

        {accountsLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Credential Account */}
            <div className="flex items-center justify-between p-4 border  rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Email & Password</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasCredentialAccount ? "Connected" : "Not set up"}
                  </p>
                </div>
              </div>
              {!hasCredentialAccount && (
                <button
                  onClick={() => setShowSetPasswordModal(true)}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Set Password
                </button>
              )}
            </div>

            {/* Google Account */}
            <div className="flex items-center justify-between p-4 border  rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Google</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {hasGoogleAccount ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              {hasGoogleAccount ? (
                <button
                  onClick={() => handleUnlinkAccount("google")}
                  disabled={!canUnlink || unlinkingAccount === "google"}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!canUnlink ? "You must have at least one sign-in method" : ""}
                >
                  {unlinkingAccount === "google" ? "Unlinking..." : "Unlink"}
                </button>
              ) : (
                <button
                  onClick={handleLinkGoogle}
                  disabled={linkingGoogle}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {linkingGoogle ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className=" rounded-xl shadow-sm border  p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Two-Factor Authentication
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${is2FAEnabled
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
              }`}
          >
            {is2FAEnabled ? "Enabled" : "Disabled"}
          </div>
        </div>

        <div className="border-t  pt-4">
          {!hasCredentialAccount ? (
            <div className="space-y-4">
              <p className="text-sm text-amber-600 dark:text-amber-400">
                You need to set a password before you can enable 2FA. This is required for account recovery.
              </p>
              <button
                onClick={() => setShowSetPasswordModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Set Password First
              </button>
            </div>
          ) : is2FAEnabled ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Two-factor authentication is enabled. You&apos;ll need to enter a verification code from
                your authenticator app when signing in.
              </p>
              <button
                onClick={() => setShowDisableModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Disable 2FA
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Protect your account with a second layer of security. Once enabled, you&apos;ll need to
                enter a code from your authenticator app in addition to your password when signing in.
              </p>
              <button
                onClick={() => setShowEnableModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Enable 2FA
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Set Password Modal */}
      {showSetPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className=" rounded-2xl shadow-xl max-w-md w-full p-6">
            {passwordSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Password Set Successfully!
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You can now sign in with your email and password.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Set Your Password
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Create a password to sign in with your email. This also allows you to enable 2FA.
                </p>
                <div className="space-y-4">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    minLength={8}
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    minLength={8}
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSetPassword}
                      disabled={settingPassword}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                    >
                      {settingPassword ? "Setting..." : "Set Password"}
                    </button>
                    <button
                      onClick={closePasswordModal}
                      className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Enable 2FA Modal */}
      {showEnableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className=" rounded-2xl shadow-xl max-w-md w-full p-6">
            {setupStep === "password" && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Enable Two-Factor Authentication
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Enter your password to continue setting up 2FA.
                </p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
                />
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleEnable2FA}
                    disabled={isEnabling}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                  >
                    {isEnabling ? "Setting up..." : "Continue"}
                  </button>
                  <button
                    onClick={closeModal}
                    className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {setupStep === "qr" && totpUri && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Scan QR Code
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div className="flex justify-center mb-4 p-4 bg-white rounded-lg">
                  <QRCode value={totpUri} size={200} />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4 break-all">
                  Can&apos;t scan? Enter this code manually: <br />
                  <code className="text-blue-600">{totpUri.split("secret=")[1]?.split("&")[0]}</code>
                </p>
                <button
                  onClick={() => setSetupStep("verify")}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  I&apos;ve Scanned the Code
                </button>
              </>
            )}

            {setupStep === "verify" && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Verify Setup
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Enter the 6-digit code from your authenticator app to verify the setup.
                </p>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
                />
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={handleVerifyTotp}
                    disabled={isEnabling || verificationCode.length !== 6}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
                  >
                    {isEnabling ? "Verifying..." : "Verify & Enable"}
                  </button>
                  <button
                    onClick={() => setSetupStep("qr")}
                    className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {setupStep === "backup" && backupCodes && (
              <>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Save Your Backup Codes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Save these backup codes in a secure place. You can use them to access your account if
                  you lose your authenticator device.
                </p>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <code
                        key={index}
                        className="text-sm font-mono text-gray-800 dark:text-gray-200"
                      >
                        {code}
                      </code>
                    ))}
                  </div>
                </div>
                <button
                  onClick={copyBackupCodes}
                  className="w-full py-2 mb-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Copy Codes
                </button>
                <p className="text-xs text-red-500 mb-4 text-center">
                  Warning: Each backup code can only be used once. Store them securely!
                </p>
                <button
                  onClick={closeModal}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className=" rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Disable Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to disable 2FA? This will make your account less secure.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleDisable2FA}
                disabled={isDisabling}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors"
              >
                {isDisabling ? "Disabling..." : "Disable 2FA"}
              </button>
              <button
                onClick={closeModal}
                className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
