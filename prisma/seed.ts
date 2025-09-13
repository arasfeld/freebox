import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testUsers = [
  {
    name: 'Adam Rasfeld',
    email: 'arasfeld@gmail.com',
    image: null,
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    image: null,
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    image: null,
  },
  {
    name: 'Carol Davis',
    email: 'carol@example.com',
    image: null,
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    image: null,
  },
  {
    name: 'Emma Brown',
    email: 'emma@example.com',
    image: null,
  },
];

const testAddresses = [
  // Adam's addresses
  {
    userId: '', // Will be set after user creation
    label: 'Home',
    address: '123 Main Street',
    city: 'Cincinnati',
    state: 'OH',
    zipCode: '45202',
    latitude: 39.1031,
    longitude: -84.512,
    isDefault: true,
    isActive: true,
  },
  {
    userId: '', // Will be set after user creation
    label: 'Work',
    address: '456 Business Plaza',
    city: 'Cincinnati',
    state: 'OH',
    zipCode: '45201',
    latitude: 39.1,
    longitude: -84.51,
    isDefault: false,
    isActive: true,
  },
  // Alice's address
  {
    userId: '', // Will be set after user creation
    label: 'Home',
    address: '456 Oak Avenue',
    city: 'West Chester',
    state: 'OH',
    zipCode: '45069',
    latitude: 39.3297,
    longitude: -84.4083,
    isDefault: true,
    isActive: true,
  },
  // Bob's address
  {
    userId: '', // Will be set after user creation
    label: 'Home',
    address: '789 Pine Street',
    city: 'Mason',
    state: 'OH',
    zipCode: '45040',
    latitude: 39.3601,
    longitude: -84.3099,
    isDefault: true,
    isActive: true,
  },
  // Carol's addresses
  {
    userId: '', // Will be set after user creation
    label: 'Home',
    address: '321 Elm Drive',
    city: 'Blue Ash',
    state: 'OH',
    zipCode: '45242',
    latitude: 39.232,
    longitude: -84.378,
    isDefault: true,
    isActive: true,
  },
  {
    userId: '', // Will be set after user creation
    label: 'Apartment',
    address: '789 University Ave',
    city: 'Blue Ash',
    state: 'OH',
    zipCode: '45236',
    latitude: 39.24,
    longitude: -84.38,
    isDefault: false,
    isActive: true,
  },
  // David's address
  {
    userId: '', // Will be set after user creation
    label: 'Home',
    address: '654 Maple Lane',
    city: 'Loveland',
    state: 'OH',
    zipCode: '45140',
    latitude: 39.2689,
    longitude: -84.2638,
    isDefault: true,
    isActive: true,
  },
  // Emma's address
  {
    userId: '', // Will be set after user creation
    label: 'Home',
    address: '987 Cedar Court',
    city: 'Covington',
    state: 'KY',
    zipCode: '41011',
    latitude: 39.0837,
    longitude: -84.5085,
    isDefault: true,
    isActive: true,
  },
];

const testItems = [
  {
    title: '32" Samsung Smart TV',
    description:
      'Excellent condition Samsung Smart TV, 32 inches. Perfect for a bedroom or small living room. Comes with remote and power cable. Upgraded to a larger TV, so this one needs a new home.',
    category: 'Electronics',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059340/tv_w32ae1.jpg',
    ],
  },
  {
    title: 'Wooden Train Set - Complete Collection',
    description:
      'Beautiful wooden train set with tracks, bridges, and multiple train cars. Great condition, perfect for kids aged 3-8. All pieces included and in excellent shape.',
    category: 'Toys & Games',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059340/train-toy_emsynw.jpg',
    ],
  },
  {
    title: 'Professional Soccer Ball',
    description:
      'High-quality soccer ball, size 5. Used for a few games but still in great condition. Perfect for practice or casual games. No punctures or damage.',
    category: 'Sports',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059340/soccer-ball_jbyygm.jpg',
    ],
  },
  {
    title: 'Nike Running Shoes - Size 10',
    description:
      'Comfortable Nike running shoes, size 10. Lightly used, still have plenty of life left. Great for jogging or casual wear. Clean and well-maintained.',
    category: 'Clothing',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059339/shoes_j4mq7c.jpg',
    ],
  },
  {
    title: 'Solid Wood Dining Table',
    description:
      'Beautiful solid wood dining table, seats 6 people comfortably. Sturdy construction, perfect for family meals. Some minor wear but overall excellent condition.',
    category: 'Furniture',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059339/table_etgyd7.jpg',
    ],
  },
  {
    title: 'Cotton T-Shirt Collection',
    description:
      'Collection of 5 cotton t-shirts in various colors and sizes. All in good condition, perfect for everyday wear. Mix of casual and graphic tees.',
    category: 'Clothing',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059339/tshirt_mlxvez.jpg',
    ],
  },
  {
    title: 'iPhone 12 - 128GB',
    description:
      'iPhone 12 in excellent condition, 128GB storage. Comes with original charger and case. Screen protector included. Upgraded to newer model.',
    category: 'Electronics',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059339/phone_kciixe.jpg',
    ],
  },
  {
    title: 'Original Oil Painting - Landscape',
    description:
      'Beautiful original oil painting of a mountain landscape. Hand-painted, signed by the artist. Perfect for home decoration. Frame included.',
    category: 'Other',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/painting_ddrjby.jpg',
    ],
  },
  {
    title: 'Dell Laptop - Windows 10',
    description:
      'Dell Inspiron laptop, 15.6 inch screen, 8GB RAM, 256GB SSD. Runs Windows 10 smoothly. Perfect for work or school. Comes with charger.',
    category: 'Electronics',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/laptop_dfqwpi.jpg',
    ],
  },
  {
    title: 'Complete Garden Tool Set',
    description:
      'Professional garden tool set including shovel, rake, hoe, pruning shears, and watering can. All tools in excellent condition. Perfect for maintaining a garden.',
    category: 'Home & Garden',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/garden-tools_ymtyum.jpg',
    ],
  },
  {
    title: 'Comfortable Living Room Couch',
    description:
      'Large, comfortable couch perfect for a living room. Neutral color, fabric upholstery. Great condition, no stains or tears. Seats 3-4 people comfortably.',
    category: 'Furniture',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/couch_vgylsy.jpg',
    ],
  },
  {
    title: 'Gas-Powered Lawn Mower',
    description:
      'Reliable gas-powered lawn mower, self-propelled. Well-maintained, starts easily. Perfect for medium to large yards. Recently serviced and ready to use.',
    category: 'Home & Garden',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/lawnmower_rmtk4x.jpg',
    ],
  },
  {
    title: 'Classic Novel Collection',
    description:
      'Collection of classic novels including "Pride and Prejudice", "1984", "The Great Gatsby", and more. All hardcover editions in excellent condition.',
    category: 'Books',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/book_ehyms8.jpg',
    ],
  },
  {
    title: 'Educational Books for Children',
    description:
      "Large collection of educational children's books for ages 5-12. Mix of fiction and non-fiction. Great for homeschooling or supplementing school learning.",
    category: 'Books',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/books_yjqeh0.jpg',
    ],
  },
  {
    title: 'Family Board Games Collection',
    description:
      'Complete collection of family board games including Monopoly, Scrabble, Clue, and more. All games have all pieces and instructions. Perfect for family game nights.',
    category: 'Toys & Games',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/board-games_lmlfmh.jpg',
    ],
  },
  {
    title: 'Building Blocks Set',
    description:
      'Large set of colorful building blocks for creative play. Compatible with major brands. Great for developing motor skills and creativity. All pieces included.',
    category: 'Toys & Games',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/blocks-toy_c5ybnd.jpg',
    ],
  },
  {
    title: 'Acoustic Guitar - Yamaha',
    description:
      'Beautiful Yamaha acoustic guitar with rich sound. Perfect for beginners or intermediate players. Comes with case, tuner, and extra strings. Well-maintained.',
    category: 'Other',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/acoustic-guitar_m9m9b5.jpg',
    ],
  },
  {
    title: 'Mountain Bike - Trek',
    description:
      'Trek mountain bike in excellent condition. 21-speed, perfect for trails and city riding. Recently serviced with new tires and brakes. Helmet included.',
    category: 'Sports',
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/bike_no6d4l.jpg',
    ],
  },
];

async function getUserStats(userId: string) {
  // Get total items received
  const totalItemsReceived = await prisma.item.count({
    where: {
      interests: {
        some: {
          userId,
          selected: true,
        },
      },
    },
  });

  // Get total items given
  const totalItemsGiven = await prisma.item.count({
    where: {
      userId,
      status: 'TAKEN',
    },
  });

  // Calculate average response time (simplified for now)
  const averageResponseTime = 24; // Default 24 hours

  // Get last activity
  const lastActivity = new Date().toISOString();

  return {
    totalItemsReceived,
    totalItemsGiven,
    averageResponseTime,
    lastActivity,
  };
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Handle test users - be careful with existing users
  console.log('Processing test users...');
  const createdUsers = [];

  for (const userData of testUsers) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
      include: { accounts: true },
    });

    if (existingUser) {
      // User exists - check if it has NextAuth accounts
      if (existingUser.accounts.length > 0) {
        console.log(
          `✅ User exists with NextAuth: ${existingUser.name} (${existingUser.email})`
        );
        createdUsers.push(existingUser);
      } else {
        // User exists but no NextAuth accounts - update with seed data
        console.log(
          `⚠️  User exists without NextAuth, updating: ${existingUser.name} (${existingUser.email})`
        );
        const updatedUser = await prisma.user.update({
          where: { email: userData.email },
          data: {
            name: userData.name,
            image: userData.image,
          },
        });
        createdUsers.push(updatedUser);
      }
    } else {
      // User doesn't exist - create new user
      console.log(`🆕 Creating new user: ${userData.name} (${userData.email})`);
      const newUser = await prisma.user.create({
        data: userData,
      });
      createdUsers.push(newUser);
    }
  }

  // Create test addresses
  console.log('\nCreating test addresses...');
  const addressData = [
    // Adam's addresses (index 0)
    { userIndex: 0, addresses: testAddresses.slice(0, 2) },
    // Alice's address (index 1)
    { userIndex: 1, addresses: testAddresses.slice(2, 3) },
    // Bob's address (index 2)
    { userIndex: 2, addresses: testAddresses.slice(3, 4) },
    // Carol's addresses (index 3)
    { userIndex: 3, addresses: testAddresses.slice(4, 6) },
    // David's address (index 4)
    { userIndex: 4, addresses: testAddresses.slice(6, 7) },
    // Emma's address (index 5)
    { userIndex: 5, addresses: testAddresses.slice(7, 8) },
  ];

  for (const { userIndex, addresses } of addressData) {
    const user = createdUsers[userIndex];
    for (const addressData of addresses) {
      const address = await prisma.address.create({
        data: {
          ...addressData,
          userId: user.id,
        },
      });
      console.log(`Created address: ${address.label} for ${user.name}`);
    }
  }

  // Create test items
  console.log('\nCreating test items...');
  for (let i = 0; i < testItems.length; i++) {
    const itemData = testItems[i];
    const user = createdUsers[i % createdUsers.length]; // Distribute items among users

    // Get the user's default address
    const userAddress = await prisma.address.findFirst({
      where: {
        userId: user.id,
        isDefault: true,
      },
    });

    const item = await prisma.item.create({
      data: {
        ...itemData,
        userId: user.id,
        addressId: userAddress?.id,
        status: 'AVAILABLE',
      },
    });

    console.log(
      `Created item: ${item.title} (by ${user.name}) at ${userAddress?.address || 'no address'}`
    );
  }

  // Add interests to Adam's existing items
  console.log("\nAdding interests to Adam's items...");
  const adamUser = createdUsers.find(
    user => user.email === 'arasfeld@gmail.com'
  );

  if (adamUser) {
    // Get Adam's existing items
    const existingAdamItems = await prisma.item.findMany({
      where: { userId: adamUser.id },
      include: { interests: true },
    });

    if (existingAdamItems.length > 0) {
      console.log(`Found ${existingAdamItems.length} items for Adam`);

      // Add interests to the first item (Samsung TV)
      const targetItem = existingAdamItems[0];

      if (targetItem.interests.length === 0) {
        // Update item status to PENDING
        await prisma.item.update({
          where: { id: targetItem.id },
          data: { status: 'PENDING' },
        });

        // Create interests from other users
        const interestUsers = createdUsers
          .filter(user => user.email !== 'arasfeld@gmail.com')
          .slice(0, 4);

        for (let i = 0; i < interestUsers.length; i++) {
          const interestUser = interestUsers[i];
          const userStats = await getUserStats(interestUser.id);

          await prisma.itemInterest.create({
            data: {
              itemId: targetItem.id,
              userId: interestUser.id,
              timestamp: new Date(Date.now() - i * 1000 * 60 * 30), // 30 minutes apart
              userStats: userStats,
            },
          });

          console.log(
            `Created interest from ${interestUser.name} on "${targetItem.title}"`
          );
        }
      } else {
        console.log(
          `Item "${targetItem.title}" already has ${targetItem.interests.length} interests`
        );
      }
    } else {
      console.log('No items found for Adam');
    }
  }

  console.log('\n✅ Database seeded successfully!');
  console.log(
    `Created ${createdUsers.length} users, ${testAddresses.length} addresses, and ${testItems.length} items`
  );
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
