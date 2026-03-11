import { PageHeader } from '@/components/ui/PageHeader'
import { RecipeEditor } from '@/components/recipes/RecipeEditor'

export default function RecipesPage() {
  return (
    <>
      <PageHeader
        title="Công thức"
        subtitle="Định mức nguyên liệu cho mỗi bát"
      />
      <RecipeEditor />
    </>
  )
}
