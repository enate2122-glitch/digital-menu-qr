export interface MenuItem {
  id: string; name: string; description: string | null;
  price: number; image_url: string | null;
  is_available: boolean; display_order: number;
}
export interface Category {
  id: string; name: string; display_order: number; items: MenuItem[];
}
export interface MenuData {
  restaurant: {
    name: string; logo_url: string | null;
    primary_color: string | null; address?: string | null;
    menu_theme: string;
    phone?: string | null;
    cover_image_url?: string | null;
  };
  categories: Category[];
}
