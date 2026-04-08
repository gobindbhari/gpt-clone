import { Calendar, Circle, FolderCode, Home, Inbox, PenBox, Search, Settings, Text, X } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { DeleteChatBtn } from "./DeleteChatBtn";

interface Props {
    newChat?: () => void;
    batches: { id: string; messages: any[] }[];
    currentBatchId: string;
    switchChat: (id: string) => void;
    deleteChat: (id: string) => void;
}

export default function SidebarDemo({ newChat, batches, currentBatchId, switchChat, deleteChat }: Props) {

    const items = [
        {
            title: "New chat",
            // url: "/",
            icon: PenBox,
            fc: newChat
        },
        {
            title: "Search chat",
            url: "#",
            icon: Search,
        },
        {
            title: "Apps",
            url: "#",
            icon: Circle,
        },
        {
            title: "Projects",
            url: "#",
            icon: FolderCode,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
        },
    ];

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="flex justify-between mb-1">
                            {/* <span>AI-Assistance</span> */}
                            <span className="text-sm">Thread-AI {` (Gust-mode)`}</span>

                            <ModeToggle/>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map(({ title, icon: Icon, url, fc }) => (
                                    <SidebarMenuItem key={title}>
                                        <SidebarMenuButton onClick={() => {
                                            if (fc) fc()
                                        }} render={url ? <a href={url} /> : <div></div>}>
                                            <Icon />
                                            <span>{title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                            <Separator />
                            <SidebarGroupLabel><Text className="mr-2" /> Recent chats</SidebarGroupLabel>
                            <SidebarMenu>
                                {batches.toReversed().map((batch) => {
                                    const firstMessage = batch.messages[0]?.versions?.[0]?.content || "New Chat";

                                    return (
                                        <SidebarMenuItem key={batch.id} className="flex items-center gap-1">
                                            <SidebarMenuButton
                                                onClick={() => switchChat(batch.id)}
                                                className={batch.id === currentBatchId ? "bg-gray-200 dark:bg-gray-800" : ""}
                                            >
                                                <span className="truncate">
                                                    {firstMessage.slice(0, 30)}
                                                </span>
                                            </SidebarMenuButton>
                                            {/* delete button */}
                                            <DeleteChatBtn fc={() => deleteChat(batch.id)} />
                                            {/* <Button
                                                onClick={() => deleteChat(batch.id)}
                                                className="text-red-900 px-2 hover:text-red-600 -mt-0.5"
                                            >
                                                <X/>
                                            </Button> */}
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>

                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <main className="p-4">
                <SidebarTrigger />
                {/* Main content going here */}
            </main>
        </SidebarProvider>
    );
}
