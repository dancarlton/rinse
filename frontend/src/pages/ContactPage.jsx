import ContactForm from "../components/ContactForm";
import ToggleButton from "../components/ToggleButton";

const ContactPage = () => (
  <>
    <ToggleButton buttonLabel="reveal">
      <ContactForm />
    </ToggleButton>
  </>
);

export default ContactPage;
