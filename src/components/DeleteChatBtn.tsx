//  DeleteChatBtn

import { Trash2Icon, X } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteChatBtn({fc}: {fc: ()=> void}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} className={"h-6 w-6 cursor-pointer bg-transparent! hover:bg-red-900/70!"} variant="destructive"><X className="h-4!"/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm" className="bg-black!">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation. View{" "}
            Settings delete any memories saved during this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline"  className="cursor-pointer" >Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=> fc()} variant="destructive" className="cursor-pointer">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

