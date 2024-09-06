import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const TestButton = () => {
    const [isLoading,setLoading] = useState(false);

    const onClick = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/run-seed', { 
                method: 'GET',
                
            });
            const data = await response.json();
            if (response.ok) {
                setLoading(false)
                window.location.reload();

                alert(data.message);
            } else {
                setLoading(false)
                alert(data.error || '执行失败');
            }
        } catch (error) {
            console.error('发生错误:', error);
            alert('发生错误');
        }
    }
    return (
        <>
         {isLoading &&  <Button className="mx-4 px-10" variant="outline">
            <Loader2  className="animate-spin text-foreground"/>
         </Button>
            
         }
         {!isLoading && (
                <Button onClick={onClick} disabled={isLoading} className="mx-4 text-blue-700" variant="outline">
                    点击生成示例数据
                </Button>
            )}

        </>
    )
}
 
export default TestButton;