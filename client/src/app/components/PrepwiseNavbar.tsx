import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'

export default function PrepwiseNavbar() {
    return (
        <div>
            
           <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink>Pricing</NavigationMenuLink> 
                    </NavigationMenuItem>
                    <NavigationMenuItem>Contact</NavigationMenuItem>
                </NavigationMenuList>
           </NavigationMenu>
        </div>
    )
}