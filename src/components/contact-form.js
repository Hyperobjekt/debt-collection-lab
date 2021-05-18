import React, { useRef, useState } from "react";
import clsx from "clsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Block } from "@hyperobjekt/material-ui-website";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  root: {
    maxWidth: 720,
  },
  submitting: {},
  // hide form when submitting
  submitted: {
    "& $row": {
      display: "none",
    },
  },
  form: {},
  row: {
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing(2, 0),
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.up("sm")]: {
      "& > * + *": {
        marginTop: 0,
        marginLeft: theme.spacing(2),
      },
    },
  },
  input: {
    minWidth: "100%",
    [theme.breakpoints.up("sm")]: {
      minWidth: theme.spacing(32),
      flex: 1,
    },
  },
  multiline: {
    width: "100%",
  },
  submit: {},
  spinner: {},
  message: {},
});

const ContactForm = ({
  classes,
  className,
  title,
  success,
  failed,
  formikOverrides,
  ...props
}) => {
  const honeypotRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmittedError, setIsSubmittedError] = useState(false);
  const encode = (data) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  };

  // handler for form submission
  const handleSubmit = (values, actions) => {
    // detect spam with honeypot
    if (honeypotRef.current.value !== "") return;
    // netlify forms submission
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({ "form-name": "contact", ...values }),
    })
      .then(() => {
        formik.setSubmitting(false);
        setIsSubmitted(true);
        formik.resetForm();
      })
      .catch((error) => {
        console.log("Submission error:", error);
        formik.setSubmitting(false);
        setIsSubmittedError(true);
      });
  };

  // Formik configuration, can be overridden with `formikOverrides` props
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("You must enter your name."),
      email: Yup.string().email("Invalid email address").required("Required"),
      message: Yup.string().required("You must enter a message."),
    }),
    onSubmit: handleSubmit,
    ...formikOverrides,
  });
  return (
    <Block
      className={clsx(
        "contact-form",
        classes.root,
        {
          [classes.submitting]: formik.isSubmitting,
          [classes.submitted]: isSubmitted,
        },
        className
      )}
      {...props}
    >
      {title && (
        <Typography gutterBottom variant="h2">
          {title}
        </Typography>
      )}
      <form
        name="contact"
        method="POST"
        onSubmit={formik.handleSubmit}
        className={classes.form}
        netlify-honeypot="bot-field"
        data-netlify="true"
      >
        <input type="hidden" name="form-name" value="contact" />
        <p hidden>
          <label htmlFor="botField">
            Don’t fill this out if you're human:{" "}
            <input id="botField" name="bot-field" ref={honeypotRef} />
          </label>
        </p>
        <Box className={clsx("contact-form__row", classes.row)}>
          <TextField
            className={clsx("contact-form__input", classes.input, {
              valid: formik.touched.name && !formik.errors.name,
            })}
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={formik.touched.name && formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          <TextField
            className={clsx("contact-form__input", classes.input, {
              valid: formik.touched.email && !formik.errors.email,
            })}
            id="email"
            name="email"
            label="Email Address"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            error={formik.touched.email && formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
        </Box>
        <Box className={clsx("contact-form__row", classes.row)}>
          <TextField
            className={clsx(
              "contact-form__input",
              "contact-form__input--multiline",
              classes.input,
              classes.multiline,
              {
                valid: formik.touched.message && !formik.errors.message,
              }
            )}
            id="message"
            name="message"
            label="Message"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            multiline
            rows={4}
            rowsMax={10}
            error={formik.touched.message && formik.errors.message}
            helperText={formik.touched.message && formik.errors.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.message}
          />
        </Box>
        <Box
          className={clsx("contact-form__row", classes.row)}
          alignItems="center"
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={clsx("contact-form__submit", classes.submit, {
              submitting: formik.isSubmitting,
            })}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          {formik.isSubmitting && (
            <CircularProgress
              className={clsx("contact-form__spinner", classes.spinner)}
              size={16}
            />
          )}
        </Box>
        <Box className={clsx("contact-form__message", classes.message)}>
          {isSubmitted && !isSubmittedError && (
            <Typography
              className={clsx("contact-form__success", classes.success)}
              role="alert"
            >
              {success}
            </Typography>
          )}
          {isSubmittedError && (
            <Typography
              className={clsx("contact-form__failed", classes.failed)}
              role="alert"
            >
              {failed}
            </Typography>
          )}
        </Box>
      </form>
    </Block>
  );
};

ContactForm.defaultProps = {
  success: "Messsage received! Thanks for contacting us.",
  failed: "Sorry, something went wrong with the form submission.",
  formikOverrides: {},
};

export default withStyles(styles)(ContactForm);
