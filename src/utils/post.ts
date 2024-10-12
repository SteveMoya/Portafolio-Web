import { getCollection, type CollectionEntry } from 'astro:content'

type relatedPostsType = CollectionEntry<'blog'>


export const getCategories = async () => {
	const posts = await getPosts()
	const categories = new Set(posts.map((post) => post.data.category))
	return Array.from(categories)
}

export const getPosts = async (max?: number) => {
	return (
		await getCollection('blog'))
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, max)
}

export const getRelatedPosts = async (post: relatedPostsType) => {
	const lowercaseTags = post.data.tags.map((tag) => tag.toLowerCase())
	const posts = await getPosts()
	const relatedPosts = posts.filter(
		(p) =>
			p.slug !== post.slug &&
			p.data.tags.some((t) => lowercaseTags.includes(t.toLowerCase()))
	)
	return relatedPosts.slice(0, 3)
}

export const getTags = async () => {
	const posts = await getPosts()
	const tags = new Set()
	posts.forEach((post) => {
		post.data.tags.forEach((tag) => {
			tags.add(tag.toLowerCase())
		})
	})

	return Array.from(tags)
}

export const getPostByTag = async (tag: string) => {
	const posts = await getPosts()
	const lowercaseTag = tag.toLowerCase()
	return posts.filter((post) => {
		return post.data.tags.some((postTag) => postTag.toLowerCase() === lowercaseTag)
	})
}

export const filterPostsByCategory = async (category: string) => {
	const posts = await getPosts()
	return posts.filter((post) => post.data.category.toLowerCase() === category)
}
