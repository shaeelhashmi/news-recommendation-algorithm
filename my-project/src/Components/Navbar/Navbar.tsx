export default function Navbar() {
  return (
    <div className="fixed top-0 w-full p-3 bg-[#8476df] flex flex-row font-serif ">
      <div><h1 className="mr-5 text-2xl">News Master</h1></div>
      <div className="font-serif mx-7"><a href="world">World</a></div>
      <div className="font-serif mx-7"><a href="politics">Politics</a></div>
      <div className="font-serif mx-7"><a href="business">Business</a></div>
      <div className="font-serif mx-7"><a href="health">Health</a></div>
      <div className="font-serif mx-7"><a href="entertainment">Entertainment</a></div>
      <div className="font-serif mx-7"><a href="style">Style</a></div>
      <div className="font-serif mx-7"><a href="travel">Travel</a></div>
    </div>
  )
}
