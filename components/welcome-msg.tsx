import { useUser } from "@clerk/nextjs";

const WelcomeMsg = () => {
    const {user, isLoaded} = useUser();
    return ( 
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                欢 迎 回 来{isLoaded?", ":""}{user?.username} {isLoaded?'👋':""}
            </h2>
            <p className="text-sm lg:text-base text-[#89b6fd]">
                这 里 是 你 的 财 务 信 息 报 告
            </p>
        </div>
     );
}
 
export default WelcomeMsg;