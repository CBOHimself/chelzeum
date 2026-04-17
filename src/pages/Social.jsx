import { useState } from "react";
import { motion } from "framer-motion";

function makeCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  return { a, b, answer: a + b };
}

export default function Social() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    captcha: "",
  });
  const [captchaChallenge, setCaptchaChallenge] = useState(makeCaptcha);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  function updateField(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (Number(formData.captcha) !== captchaChallenge.answer) {
      setStatus({
        type: "error",
        message: "Captcha is incorrect. Please try again.",
      });
      setFormData((prev) => ({ ...prev, captcha: "" }));
      setCaptchaChallenge(makeCaptcha());
      return;
    }

    setStatus({
      type: "success",
      message: "Thanks for reaching out. We will get back to you shortly.",
    });
    setFormData({
      name: "",
      email: "",
      message: "",
      captcha: "",
    });
    setCaptchaChallenge(makeCaptcha());
  }

  return (
    <motion.main
      className="social-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="social-contact-wrap">
        <p className="art-page-count">Workshop Contact</p>
        <h1 className="art-page-title">Send a Message</h1>
        <p className="events-content-paragraph">
          Use this form to send workshop inquiries, event proposals, or collaboration
          requests. Include as much detail as possible so we can respond quickly.
        </p>

        <form className="social-contact-form" onSubmit={handleSubmit}>
          <label className="events-form-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={updateField}
              required
            />
          </label>

          <label className="events-form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={updateField}
              required
            />
          </label>

          <label className="events-form-field">
            <span>Message</span>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={updateField}
              placeholder="Tell us about your event, dates, and audience."
              required
            />
          </label>

          <label className="events-form-field">
            <span>
              Captcha: What is {captchaChallenge.a} + {captchaChallenge.b}?
            </span>
            <input
              type="number"
              name="captcha"
              value={formData.captcha}
              onChange={updateField}
              required
            />
          </label>

          <button type="submit" className="events-contact-btn">
            Send Message
          </button>

          {status.type !== "idle" && (
            <p
              className={
                status.type === "success"
                  ? "social-form-status social-form-status--success"
                  : "social-form-status social-form-status--error"
              }
            >
              {status.message}
            </p>
          )}
        </form>
      </section>
    </motion.main>
  );
}
