import Sidebar from "./components/Sidebar";
import DeliveryMap from "./components/DeliveryMap";

export default function Home() {
  const tabItems = [
    { label: 'Tab 1', content: <div><DeliveryMap/></div> },
    { label: 'Tab 2', content: <div>Content for ADTab 2</div> },
    { label: 'Tab 3', content: <div>Content for Tab 3</div> },
  ];

  return (
    <div className="p-4">
      <Sidebar tabs={tabItems} />
    </div>
  );
}
