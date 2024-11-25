import NavLinks from "./NavLinks"

export default function SideBar() {
  return (
    <aside className="fixed top-14 left-0 w-[250px] h-screen bg-[#2a17a4]  flex flex-col text-white overflow-auto pl-8 sidebar">
    <div>
      <NavLinks link='/' text='Headlines'></NavLinks>
      </div>
      <div>
      <NavLinks link='/politics' text='Politics'></NavLinks>
      </div>
      <div>
      <NavLinks link='/business' text='Business'></NavLinks>
      </div>
      <div>
      <NavLinks link='/health' text='Health'></NavLinks>
      </div>
      <div>
      <NavLinks link='/world' text='World' subLinks={['/world/africa','/world/americas','/world/asia','/world/australia','/world/china','/world/europe','/world/india','/world/middle-east','/world/united-kingdom']} subText={['Africa','Americas','Asia','Australia','China','Europe','India','Middle East','United Kingdom']}></NavLinks>
      </div>
      <div>
    <div>
      <NavLinks text='Entertainment' link='/entertainment'></NavLinks>
    </div>
    <div>
      <NavLinks text='Style' link='/style'></NavLinks>
    </div>
    <div>
      <NavLinks text='Travel' link='/travel'></NavLinks>
    </div>
    <div>
      <NavLinks text='Sports' link='/sports'></NavLinks>
    </div>
      </div>
      
    </aside>
  )
}
