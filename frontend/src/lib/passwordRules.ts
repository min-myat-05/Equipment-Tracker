export const PASSWORD_MIN_LENGTH = 8;

export type PasswordRuleCheck = {
  id: "length" | "uppercase" | "lowercase" | "special";
  label: string;
  met: boolean;
};

export function getPasswordRuleChecks(password: string): PasswordRuleCheck[] {
  return [
    {
      id: "length",
      label: `${PASSWORD_MIN_LENGTH}+ characters`,
      met: password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      id: "uppercase",
      label: "At least 1 uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least 1 lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "special",
      label: "At least 1 special character",
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

export function isPasswordStrong(password: string) {
  return getPasswordRuleChecks(password).every((rule) => rule.met);
}
