import { cn } from "@/lib/utils";
import { getPasswordRuleChecks } from "@/lib/passwordRules";

type PasswordRequirementListProps = {
  password: string;
  confirmPassword?: string;
  showConfirmMatch?: boolean;
  showConfirmMatchOnlyWhenTouched?: boolean;
  className?: string;
};

export default function PasswordRequirementList({
  password,
  confirmPassword,
  showConfirmMatch = false,
  showConfirmMatchOnlyWhenTouched = false,
  className,
}: PasswordRequirementListProps) {
  const rules = getPasswordRuleChecks(password);
  const confirmTouched = (confirmPassword ?? "").length > 0;
  const confirmMatches =
    !showConfirmMatch ||
    (((confirmPassword ?? "").length > 0 && password.length > 0) &&
      (confirmPassword ?? "") === password);
  const shouldShowConfirmMatch =
    showConfirmMatch &&
    (!showConfirmMatchOnlyWhenTouched || confirmTouched);

  const items = [
    ...rules.map((rule) => ({
      id: rule.id,
      label: rule.label,
      met: rule.met,
    })),
    ...(shouldShowConfirmMatch
      ? [
          {
            id: "confirm-match",
            label: "Passwords match",
            met: confirmMatches,
          },
        ]
      : []),
  ];

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-foreground">Password requirements</p>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              "text-sm transition-colors",
              item.met
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400",
            )}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
