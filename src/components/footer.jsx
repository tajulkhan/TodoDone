export default function Footer() {
  return (
    <>
      <footer className="max-w-6xl my-6 sm:mx-auto mx-4 ">
        <div className="flex justify-center">
          <h2 className="text-[16px] text-[#142648] mr-2">Built with ❤️ by Tajul</h2>
          <div className="flex">
            <a className="mr-2.5" href="https://github.com/tajulkhan/" target="_blank">
              <img
                src="/images/github-ic.svg"
                width={25}
                height={25}
                alt="Github"
              />
            </a>
            <a href="https://www.linkedin.com/in/tajul-khan-b-s-513758220/" target="_blank">
              <img
                src="/images/linkedin-ic.svg"
                width={22}
                height={22}
                alt="Linkedin"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
