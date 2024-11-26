import React, { useEffect } from "react";
import Graph from "../Components/Graph";
import { ShieldCheck } from "lucide-react";
import { useRecoilState} from "recoil";
import { statsState } from "../Atoms/Atoms";
import { fetchStats } from "../DBdata/Statsdata";

const Home = () => {

  const [stats, setStats] = useRecoilState(statsState);

  useEffect(()=>{
    const fetchData = async () => {
      try {
       const data= await fetchStats() 
        setStats(data);  
      } catch (err) {
        console.error("Error fetching data", err);
      } 
    };
    fetchData()
  },[setStats])


  return (
    <div className="p-2 flex h-full flex-col gap-5 md:px-10 overflow-y-scroll md:overflow-y-hidden">
      <div className="bg-secondary w-full rounded-lg flex gap-5 items-center flex-col-reverse md:flex-row">
        <div className=" p-5 md:p-10 flex flex-col gap-2">
          <h1 className="text-2xl md:text-4xl">Welcome to TraceGuard</h1>
          <p className="text-gray-400">
            TraceGad helps in identifying drug trafficking activities on social
            media by detecting suspicious keywords and images.
          </p>
        </div>
        <div className="text-accent">
            <ShieldCheck size={80}/>
        </div>
      </div>
      <div className="w-full flex gap-5 md:gap-10 items-center flex-col md:flex-row">
        <div className="bg-gradient-to-r from-fuchsia-500 to-violet-500 rounded-lg px-10 py-5 w-full md:w-1/2">
          <h1 className="text-base font-medium">Today Detection</h1>
          <span className="text-6xl">{stats.messagesToday}</span>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg px-10 py-5 w-full md:w-1/2">
          <h1 className="text-base font-medium">Total Detection</h1>
          <span className="text-6xl">{stats.totalMessages}</span>
        </div>
      </div>
      <div className="bg-secondary px-10 py-5 h-fit rounded-lg hidden md:block">
        <div>
            <h1 className="font-medium">Day to day Detection</h1>
        </div>
        <Graph />
      </div>
    </div>
  );
};

export default Home;
