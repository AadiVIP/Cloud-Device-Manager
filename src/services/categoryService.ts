import { supabase } from '../lib/supabase';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export const categoryService = {
  async fetchCategories(): Promise<Category[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to view categories.');

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as Category[]) || [];
  },

  async createCategory(dto: CreateCategoryDTO): Promise<Category> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to create a category.');

    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      throw new Error('Category name cannot be empty.');
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: trimmedName,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async updateCategory(id: string, dto: UpdateCategoryDTO): Promise<Category> {
    const trimmedName = dto.name.trim();
    if (!trimmedName) {
      throw new Error('Category name cannot be empty.');
    }

    const { data, error } = await supabase
      .from('categories')
      .update({ name: trimmedName })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
