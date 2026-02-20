export const categories = [
    {
        id: 'men',
        name: 'Erkaklar',
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
        subcategories: [
            { id: 'men-shirts', name: "Ko'ylaklar" },
            { id: 'men-pants', name: 'Shimlar' },
            { id: 'men-jackets', name: 'Kurtkalar' },
            { id: 'men-tshirts', name: 'Futbolkalar' },
            { id: 'men-suits', name: 'Kostyumlar' },
        ]
    },
    {
        id: 'women',
        name: 'Ayollar',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
        subcategories: [
            { id: 'women-dresses', name: "Ko'ylaklar" },
            { id: 'women-pants', name: 'Shimlar' },
            { id: 'women-blouses', name: 'Bluzalar' },
            { id: 'women-skirts', name: 'Yubkalar' },
            { id: 'women-coats', name: 'Paltolar' },
        ]
    },
    {
        id: 'kids',
        name: 'Bolalar',
        image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&q=80',
        subcategories: [
            { id: 'kids-tshirts', name: 'Futbolkalar' },
            { id: 'kids-pants', name: 'Shimlar' },
            { id: 'kids-dresses', name: "Ko'ylaklar" },
            { id: 'kids-jackets', name: 'Kurtkalar' },
        ]
    }
];

export const getCategoryById = (id) => {
    for (const cat of categories) {
        if (cat.id === id) return cat;
        const sub = cat.subcategories.find(s => s.id === id);
        if (sub) return { ...sub, parent: cat };
    }
    return null;
};
