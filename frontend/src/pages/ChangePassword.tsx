import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import PasswordRequirementList from "@/component/PasswordRequirementList";
import PasswordInput from "@/component/PasswordInput";
import { isPasswordStrong } from "@/lib/passwordRules";
import { cn } from "@/lib/utils";

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const trimmedNewPassword = newPassword.trim();
  const trimmedConfirmPassword = confirmPassword.trim();
  const newPasswordIsStrong = useMemo(
    () => isPasswordStrong(trimmedNewPassword),
    [trimmedNewPassword],
  );
  const passwordsMatch = trimmedNewPassword === trimmedConfirmPassword;
  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPasswordIsStrong &&
    passwordsMatch &&
    !isSubmitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword.trim() || !newPassword.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!newPasswordIsStrong) {
      setError(
        "New password must be at least 8 characters and include uppercase, lowercase, and special characters.",
      );
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Failed to change password.");
      return;
    }

    setSuccess("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-[calc(100vh-96px)] p-3 flex justify-center">
      <div className="mx-auto w-full max-w-lg">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-lg font-semibold text-foreground">
            Change Password
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update your password for this account.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="current-password">
                Current Password
              </label>
              <PasswordInput
                id="current-password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                inputClassName="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="new-password">
                New Password
              </label>
              <PasswordInput
                id="new-password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                inputClassName={cn(
                  "w-full rounded-lg border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2",
                  newPassword.length === 0
                    ? "border-border focus:ring-primary/30"
                    : newPasswordIsStrong
                      ? "border-emerald-400/70 focus:ring-emerald-500/20"
                      : "border-rose-400/70 focus:ring-rose-500/20",
                )}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <PasswordInput
                id="confirm-password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                inputClassName={cn(
                  "w-full rounded-lg border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2",
                  confirmPassword.length === 0
                    ? "border-border focus:ring-primary/30"
                    : passwordsMatch
                      ? "border-emerald-400/70 focus:ring-emerald-500/20"
                      : "border-rose-400/70 focus:ring-rose-500/20",
                )}
                required
              />
            </div>

            <PasswordRequirementList password={trimmedNewPassword} />

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
