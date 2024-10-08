import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { insertAccountSchema } from "@/db/schema"
import { Trash } from "lucide-react"


const formSchema = insertAccountSchema.pick({
    name: true
}) 
type FormValues = z.input<typeof formSchema> 

type Props = {
    id?: string,
    defaultValues?: FormValues,
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean
}
const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    }
    const handleDelete = () => {
        onDelete?.();
    }
    return ( 
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-4">
                    <FormField
                        name="name"
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>名称</FormLabel>                         
                                <FormControl>
                                    <Input
                                        placeholder=""
                                        disabled={disabled}
                                        {...field}/>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" disabled={disabled}>
                        {id? "保存更改": "创建账户"}
                    </Button>
                    {
                        id && <Button
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                        className="w-full"
                        variant="outline"
                    >
                        <Trash className="size-4 mr-4"/>
                            删除账户
                        
                    </Button>
                    }
                    
            </form>
        </Form> 
    );
}
 
export default AccountForm;