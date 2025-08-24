import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testUsers = [
  {
    name: 'Adam Rasfeld',
    email: 'arasfeld@gmail.com',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Carol Davis',
    email: 'carol@example.com',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    name: 'Emma Brown',
    email: 'emma@example.com',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  },
];

const testItems = [
  {
    title: 'Vintage Coffee Table',
    description:
      'Beautiful wooden coffee table with intricate carvings. Perfect condition, just needs a new home.',
    category: 'Furniture',
    location: 'Downtown',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'MacBook Pro 2019',
    description:
      '13-inch MacBook Pro in excellent condition. Comes with charger and case. Upgraded to a newer model.',
    category: 'Electronics',
    location: 'East Side',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Bicycle - Mountain Bike',
    description:
      'Trek mountain bike, great for trails. Recently serviced, new tires. Perfect for someone who loves outdoor adventures.',
    category: 'Sports',
    location: 'North Side',
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544191696-102dbdaeeaa5?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Book Collection - Fantasy Novels',
    description:
      'Complete collection of fantasy novels including Lord of the Rings, Game of Thrones, and more. All in great condition.',
    category: 'Books',
    location: 'West Side',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Garden Tools Set',
    description:
      'Complete set of garden tools including shovel, rake, hoe, and watering can. Perfect for starting a garden.',
    category: 'Home & Garden',
    location: 'Suburbs',
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Board Games Collection',
    description:
      'Collection of popular board games: Monopoly, Scrabble, Chess, and more. Great for family game nights.',
    category: 'Toys & Games',
    location: 'South Side',
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Winter Jacket - Large',
    description:
      'Warm winter jacket, size large. Barely worn, perfect for cold weather. Dark blue color.',
    category: 'Clothing',
    location: 'Downtown',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Kitchen Appliances',
    description:
      'Various kitchen appliances: blender, toaster, coffee maker. All working perfectly, just upgraded to newer models.',
    category: 'Home & Garden',
    location: 'East Side',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Guitar - Acoustic',
    description:
      'Beautiful acoustic guitar, great sound. Perfect for beginners or intermediate players. Comes with case.',
    category: 'Other',
    location: 'North Side',
    images: [
      'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Office Chair - Ergonomic',
    description:
      'High-quality ergonomic office chair. Very comfortable, adjustable height and backrest. Great for home office.',
    category: 'Furniture',
    location: 'West Side',
    images: [
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop',
    ],
  },
  {
    title: 'Yoga Mat and Props',
    description:
      'Complete yoga set including mat, blocks, strap, and meditation cushion. Perfect for home practice.',
    category: 'Sports',
    location: 'Suburbs',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    ],
  },
  {
    title: "Children's Books",
    description:
      "Large collection of children's books for ages 3-10. Great condition, perfect for families with young kids.",
    category: 'Books',
    location: 'South Side',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
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

  // Create test items
  console.log('\nCreating test items...');
  for (let i = 0; i < testItems.length; i++) {
    const itemData = testItems[i];
    const user = createdUsers[i % createdUsers.length]; // Distribute items among users

    const item = await prisma.item.create({
      data: {
        ...itemData,
        userId: user.id,
        status: 'AVAILABLE',
      },
    });

    console.log(`Created item: ${item.title} (by ${user.name})`);
  }

  // Add interests to Adam's existing items
  console.log("\nAdding interests to Adam's items...");
  const adamUser = createdUsers.find(
    (user) => user.email === 'arasfeld@gmail.com'
  );

  if (adamUser) {
    // Get Adam's existing items
    const existingAdamItems = await prisma.item.findMany({
      where: { userId: adamUser.id },
      include: { interests: true },
    });

    if (existingAdamItems.length > 0) {
      console.log(`Found ${existingAdamItems.length} items for Adam`);

      // Add interests to the first item (Vintage Coffee Table)
      const targetItem = existingAdamItems[0];

      if (targetItem.interests.length === 0) {
        // Update item status to PENDING
        await prisma.item.update({
          where: { id: targetItem.id },
          data: { status: 'PENDING' },
        });

        // Create interests from other users
        const interestUsers = createdUsers
          .filter((user) => user.email !== 'arasfeld@gmail.com')
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
    `Created ${createdUsers.length} users and ${testItems.length} items`
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
