import { useCallback, useState } from "react"

const ValidatedInput = ({
  name,
  isSubmitted,
  errors,
  fieldSchema,
  ...props
}) => {
  const [value,setValue] = useState("");
  const [touch,setTouch] = useState(false);
  const getErrors= useCallback(() => {
    const validationResult = fieldSchema.safeParse(value);
    return validationResult.success
     ? []
     : validationResult.error.flatten().formErrors
  },[fieldSchema,value])
  const fieldErrors = errors || getErrors();
  const errorRender = errors || isSubmitted || touch;
  const handleBlur = ()=> setTouch(true);
  const handleChange = (e) => setValue(e.currentTarget.value);
  return(
    <>
     <input
       id={name}
       name={name}
       onBlur={handleBlur}
       onChange={handleChange}
       {...props} />
       {errorRender && (
        <span className="text-sm text-red-500">{fieldErrors}</span>
       )}
    </>
  )
}
export {ValidatedInput}