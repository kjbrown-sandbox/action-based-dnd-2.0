import { Field, FieldProps } from "formik";
import { Input } from "../input";

interface FormInputProps {
   name: string;
   placeholder?: string;
   type?: React.HTMLInputTypeAttribute;
   className?: string;
}

export function FormInput({ name, placeholder, type = "text", className }: FormInputProps) {
   return (
      <Field name={name} id={name}>
         {({ field }: FieldProps) => (
            <Input {...field} type={type} placeholder={placeholder} className={className} />
         )}
      </Field>
   );
}
