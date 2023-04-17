import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useForm = ({ initState, callback, validator }) => {
  const [state, setState] = useState(initState);
  const [errors, setErrors] = useState({});
  const [isSubmited, setIsSubmited] = useState(false);

  const dispatch = useDispatch();

  const { notification } = useSelector((state) => state);

  useEffect(() => {
    const isValidErrors = () =>
      Object.values(errors).filter((error) => typeof error !== "undefined")
        .length > 0;
    if (isSubmited && !isValidErrors()) {
      callback(state);
    }
  }, [isSubmited, state, errors]);

  useEffect(() => {
    const delayCheck = setTimeout(() => {
      dispatch({
        type: "usernameExistence",
        payload: { username: state.username },
      });
    }, 1000);
    return () => clearTimeout(delayCheck);
  }, [state.username, dispatch]);

  useEffect(() => {
    const delayCheck = setTimeout(() => {
      dispatch({
        type: "emailExistence",
        payload: { email: state.email },
      });
    }, 1000);
    return () => clearTimeout(delayCheck);
  }, [state.email, dispatch]);

  const handleChange = (event) => {
    event.preventDefault();

    const { name, value } = event.target;
    setState(() => ({
      ...state,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    event.preventDefault();

    const { name: fieldName } = event.target;
    const faildFields = validator(state, fieldName, notification, setErrors);

    return setErrors(() => ({
      ...errors,
      [fieldName]: Object.values(faildFields)[0],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let errs = {};

    for (const key in state) {
      if (state[key].trim() === "") {
        const emptyFields = validator(state, key, notification);
        errs = {
          ...errs,
          [key]: Object.values(emptyFields)[0],
        };
      }
    }

    setErrors({
      ...errors,
      ...errs,
    });

    setIsSubmited(true);
  };

  return {
    handleChange,
    handleSubmit,
    handleBlur,
    state,
    errors,
  };
};

export default useForm;
