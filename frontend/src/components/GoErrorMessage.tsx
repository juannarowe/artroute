interface GoErrorMessageProps {
  error: Error | null;
}

export function GoErrorMessage({ error }: GoErrorMessageProps) {
  if (!error) {
    return null;
  }

  return (
    <p role="alert" className="text-sm text-destructive">
      We couldn't update your Go. {error.message}
    </p>
  );
}
