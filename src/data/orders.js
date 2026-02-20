const orders = [
    {
        id: 'KUZ-001',
        userId: 1,
        items: [
            { productId: 1, name: "Premium Slim Fit Ko'ylak", size: 'L', color: 'Oq', quantity: 1, price: 289000 },
            { productId: 4, name: "Sport Futbolka", size: 'M', color: 'Qora', quantity: 2, price: 129000 },
        ],
        totalAmount: 547000,
        deliveryFee: 25000,
        status: 'delivered',
        paymentMethod: 'payme',
        address: "Toshkent sh., Chilonzor t., 7-kvartal, 15-uy",
        phone: '+998901234567',
        customerName: 'Aziz Karimov',
        createdAt: '2026-02-15T10:30:00',
        updatedAt: '2026-02-18T14:00:00',
    },
    {
        id: 'KUZ-002',
        userId: 2,
        items: [
            { productId: 5, name: "Elegant Kechki Ko'ylak", size: 'M', color: 'Qizil', quantity: 1, price: 459000 },
        ],
        totalAmount: 459000,
        deliveryFee: 25000,
        status: 'shipping',
        paymentMethod: 'click',
        address: "Samarqand sh., Registon ko'chasi, 42-uy",
        phone: '+998931234567',
        customerName: 'Nilufar Rahimova',
        createdAt: '2026-02-17T15:20:00',
        updatedAt: '2026-02-19T09:00:00',
    },
    {
        id: 'KUZ-003',
        userId: 3,
        items: [
            { productId: 9, name: "Bolalar Futbolka Set", size: '5-6Y', color: "Ko'k", quantity: 3, price: 89000 },
            { productId: 10, name: "Bolalar Jinsi Shim", size: '5-6Y', color: "Ko'k", quantity: 1, price: 159000 },
        ],
        totalAmount: 426000,
        deliveryFee: 30000,
        status: 'packing',
        paymentMethod: 'cash',
        address: "Buxoro sh., Navoiy ko'chasi, 18-uy",
        phone: '+998941234567',
        customerName: 'Dilnoza Usmonova',
        createdAt: '2026-02-19T08:45:00',
        updatedAt: '2026-02-19T08:45:00',
    },
    {
        id: 'KUZ-004',
        userId: 4,
        items: [
            { productId: 11, name: "Erkaklar Kostyum To'plami", size: 'L', color: "To'q ko'k", quantity: 1, price: 1890000 },
        ],
        totalAmount: 1890000,
        deliveryFee: 0,
        status: 'pending',
        paymentMethod: 'uzum',
        address: "Toshkent sh., Mirzo Ulug'bek t., 5-uy",
        phone: '+998951234567',
        customerName: 'Bobur Toshmatov',
        createdAt: '2026-02-19T12:00:00',
        updatedAt: '2026-02-19T12:00:00',
    },
    {
        id: 'KUZ-005',
        userId: 5,
        items: [
            { productId: 8, name: "Palto - Kuz/Qish", size: 'M', color: 'Bej', quantity: 1, price: 1290000 },
            { productId: 7, name: "Ipak Bluza", size: 'S', color: 'Oq', quantity: 1, price: 329000 },
        ],
        totalAmount: 1619000,
        deliveryFee: 0,
        status: 'delivered',
        paymentMethod: 'payme',
        address: "Namangan sh., Mustaqillik ko'chasi, 30-uy",
        phone: '+998971234567',
        customerName: 'Gulnora Xasanova',
        createdAt: '2026-02-10T16:30:00',
        updatedAt: '2026-02-14T10:00:00',
    },
];

export const orderStatuses = {
    pending: { label: 'Kutilyapti', color: 'warning' },
    packing: { label: 'Qadoqlanmoqda', color: 'info' },
    shipping: { label: "Yo'lda", color: 'primary' },
    delivered: { label: 'Yetkazildi', color: 'success' },
    cancelled: { label: 'Bekor qilindi', color: 'error' },
};

export const paymentMethods = {
    cash: { label: 'Naqd pul', icon: '💵' },
    payme: { label: 'Payme', icon: '💳' },
    click: { label: 'Click', icon: '📱' },
    uzum: { label: 'Uzum', icon: '🏦' },
};

export default orders;
