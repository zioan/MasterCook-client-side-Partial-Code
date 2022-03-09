import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <p>
        Copyright {new Date().getFullYear()}. Made by{" "}
        <a target="blank" href="https://www.ioanzaharia.com">
          Ioan Zaharia
        </a>
      </p>
    </div>
  );
}

export default Footer;
