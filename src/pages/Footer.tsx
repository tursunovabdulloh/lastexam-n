export default function Footer() {
  return (
    <>
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by {""}
            <a
              href="https://t.me/Abdulloh_Tursunov"
              className="font-bold text-info hover:text-blue-500"
            >
              Abdulloh Tursunov
            </a>
          </p>
        </aside>
      </footer>
    </>
  );
}
