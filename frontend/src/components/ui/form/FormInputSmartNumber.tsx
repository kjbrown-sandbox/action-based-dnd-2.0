import { Field, FieldProps, useFormikContext } from "formik";
import InputSmartNumber from "../inputSmartNumber";

interface FormInputSmartNumberProps {
   name: string;
   placeholder?: string;
   className?: string;
}

export function FormInputSmartNumber({ name, className, placeholder }: FormInputSmartNumberProps) {
   const { setFieldValue, values } = useFormikContext();

   return (
      <Field name={name}>
         {({ field }: FieldProps) => (
            <InputSmartNumber
               {...field}
               value={field.value || ""}
               className={className}
               placeholder={placeholder}
               onChange={(e) => setFieldValue(name, e.target.value)}
               onBlur={(e) => setFieldValue(name, e.target.value)}
            />
         )}
      </Field>
   );
}
