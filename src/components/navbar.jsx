import { useState, useEffect } from "react";
export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  return (
    <>
      <div className="max-w-6xl sm:mx-auto mx-4 mt-11">
        <header className="w-full bg-[#142648] h-[60] rounded-xl p-4 flex justify-between">
          <img src="/images/logo.svg" width={111} height={34} alt="ListDone" />
          <div className="flex items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`${darkMode ? "text-white" : "text-white"}`}
            >
              {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </header>
      </div>
    </>
  );
}
