import { AdminPanelSettings, CalendarMonth, Egg, ReceiptLong } from "@mui/icons-material";
import type { NavigationItem } from "../../components/navigation/sidebar/sidebarItem/SidebarItem";

export const sidebarItems: NavigationItem[] = [
    // { label: 'Admin panel',icon: AdminPanelSettings, path: '/admin'},
    { label: 'MealPlan', icon: CalendarMonth, path: '/'},
    { label: 'Recipes', icon: ReceiptLong, path: '/recipes'},
    { label: 'Ingredients', icon: Egg, path: '/ingredients'},
];