import { FC, memo, useCallback, useMemo, useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: FC = memo(() => {
  const defaultData = useMemo(
    () => ({
      name: "",
      email: "",
      message: "",
    }),
    [],
  );

  const [data, setData] = useState<FormData>(defaultData);

  const onChange = useCallback(
    <T extends HTMLInputElement | HTMLTextAreaElement>(
      event: React.ChangeEvent<T>,
    ): void => {
      const { name, value } = event.target;

      const fieldData: Partial<FormData> = { [name]: value };

      setData({ ...data, ...fieldData });
    },
    [data],
  );

  const handleSendMessage = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      /**
       * This is a good starting point to wire up your form submission logic
       * */
      console.log("Data to send: ", data);
    },
    [data],
  );

  const inputClasses =
    "bg-forest-green/60 border-0 focus:border-0 focus:outline-none focus:ring-1 focus:ring-earth-tan rounded-md placeholder:text-earth-tan/60 placeholder:text-sm text-earth-tan text-sm transition-all duration-300 shadow-md";

  return (
    <form
      className="grid min-h-[320px] grid-cols-1 gap-y-4"
      method="POST"
      onSubmit={handleSendMessage}
    >
      <input
        className={inputClasses}
        name="name"
        onChange={onChange}
        placeholder="Name"
        required
        type="text"
      />
      <input
        autoComplete="email"
        className={inputClasses}
        name="email"
        onChange={onChange}
        placeholder="Email"
        required
        type="email"
      />
      <textarea
        className={inputClasses}
        maxLength={250}
        name="message"
        onChange={onChange}
        placeholder="Message"
        required
        rows={6}
      />
      <button
        aria-label="Submit contact form"
        className="w-max rounded-full border-2 border-earth-tan bg-forest-green/70 px-4 py-2 text-sm font-medium text-earth-tan shadow-md outline-none hover:bg-deep-forest focus:ring-2 focus:ring-earth-tan focus:ring-offset-2 focus:ring-offset-deep-forest transition-all duration-300 hover:scale-105 hover:shadow-lg"
        type="submit"
      >
        Send Message
      </button>
    </form>
  );
});

ContactForm.displayName = "ContactForm";
export default ContactForm;
