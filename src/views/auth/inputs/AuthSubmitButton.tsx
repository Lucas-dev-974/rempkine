interface AuthSubmitButtonProps {
  text: string;
}

export function AuthSubmitButton(props: AuthSubmitButtonProps) {
  return (
    <button
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 "
      type="submit"
    >
      {props.text}
    </button>
  );
}
