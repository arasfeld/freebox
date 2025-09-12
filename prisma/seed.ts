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

const testItems = [
  {
    title: '32" Samsung Smart TV',
    description:
      'Excellent condition Samsung Smart TV, 32 inches. Perfect for a bedroom or small living room. Comes with remote and power cable. Upgraded to a larger TV, so this one needs a new home.',
    category: 'Electronics',
    location: 'Downtown Cincinnati',
    latitude: 39.1031,
    longitude: -84.512,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059340/tv_w32ae1.jpg',
    ],
  },
  {
    title: 'Wooden Train Set - Complete Collection',
    description:
      'Beautiful wooden train set with tracks, bridges, and multiple train cars. Great condition, perfect for kids aged 3-8. All pieces included and in excellent shape.',
    category: 'Toys & Games',
    location: 'West Chester',
    latitude: 39.3297,
    longitude: -84.4083,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059340/train-toy_emsynw.jpg',
    ],
  },
  {
    title: 'Professional Soccer Ball',
    description:
      'High-quality soccer ball, size 5. Used for a few games but still in great condition. Perfect for practice or casual games. No punctures or damage.',
    category: 'Sports',
    location: 'Mason',
    latitude: 39.3601,
    longitude: -84.3099,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059340/soccer-ball_jbyygm.jpg',
    ],
  },
  {
    title: 'Nike Running Shoes - Size 10',
    description:
      'Comfortable Nike running shoes, size 10. Lightly used, still have plenty of life left. Great for jogging or casual wear. Clean and well-maintained.',
    category: 'Clothing',
    location: 'Blue Ash',
    latitude: 39.232,
    longitude: -84.378,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059339/shoes_j4mq7c.jpg',
    ],
  },
  {
    title: 'Solid Wood Dining Table',
    description:
      'Beautiful solid wood dining table, seats 6 people comfortably. Sturdy construction, perfect for family meals. Some minor wear but overall excellent condition.',
    category: 'Furniture',
    location: 'Loveland',
    latitude: 39.2689,
    longitude: -84.2638,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059339/table_etgyd7.jpg',
    ],
  },
  {
    title: 'Cotton T-Shirt Collection',
    description:
      'Collection of 5 cotton t-shirts in various colors and sizes. All in good condition, perfect for everyday wear. Mix of casual and graphic tees.',
    category: 'Clothing',
    location: 'Covington',
    latitude: 39.0837,
    longitude: -84.5085,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059339/tshirt_mlxvez.jpg',
    ],
  },
  {
    title: 'iPhone 12 - 128GB',
    description:
      'iPhone 12 in excellent condition, 128GB storage. Comes with original charger and case. Screen protector included. Upgraded to newer model.',
    category: 'Electronics',
    location: 'Newport',
    latitude: 39.0914,
    longitude: -84.4958,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059339/phone_kciixe.jpg',
    ],
  },
  {
    title: 'Original Oil Painting - Landscape',
    description:
      'Beautiful original oil painting of a mountain landscape. Hand-painted, signed by the artist. Perfect for home decoration. Frame included.',
    category: 'Other',
    location: 'Hyde Park',
    latitude: 39.1306,
    longitude: -84.4233,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/painting_ddrjby.jpg',
    ],
  },
  {
    title: 'Dell Laptop - Windows 10',
    description:
      'Dell Inspiron laptop, 15.6 inch screen, 8GB RAM, 256GB SSD. Runs Windows 10 smoothly. Perfect for work or school. Comes with charger.',
    category: 'Electronics',
    location: 'Oakley',
    latitude: 39.1478,
    longitude: -84.4305,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/laptop_dfqwpi.jpg',
    ],
  },
  {
    title: 'Complete Garden Tool Set',
    description:
      'Professional garden tool set including shovel, rake, hoe, pruning shears, and watering can. All tools in excellent condition. Perfect for maintaining a garden.',
    category: 'Home & Garden',
    location: 'Montgomery',
    latitude: 39.2281,
    longitude: -84.3541,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/garden-tools_ymtyum.jpg',
    ],
  },
  {
    title: 'Comfortable Living Room Couch',
    description:
      'Large, comfortable couch perfect for a living room. Neutral color, fabric upholstery. Great condition, no stains or tears. Seats 3-4 people comfortably.',
    category: 'Furniture',
    location: 'Madeira',
    latitude: 39.1909,
    longitude: -84.3638,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/couch_vgylsy.jpg',
    ],
  },
  {
    title: 'Gas-Powered Lawn Mower',
    description:
      'Reliable gas-powered lawn mower, self-propelled. Well-maintained, starts easily. Perfect for medium to large yards. Recently serviced and ready to use.',
    category: 'Home & Garden',
    location: 'Mount Lookout',
    latitude: 39.1239,
    longitude: -84.4344,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/lawnmower_rmtk4x.jpg',
    ],
  },
  {
    title: 'Classic Novel Collection',
    description:
      'Collection of classic novels including "Pride and Prejudice", "1984", "The Great Gatsby", and more. All hardcover editions in excellent condition.',
    category: 'Books',
    location: 'Bellevue',
    latitude: 39.1064,
    longitude: -84.4788,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059338/book_ehyms8.jpg',
    ],
  },
  {
    title: 'Educational Books for Children',
    description:
      "Large collection of educational children's books for ages 5-12. Mix of fiction and non-fiction. Great for homeschooling or supplementing school learning.",
    category: 'Books',
    location: 'Dayton',
    latitude: 39.1128,
    longitude: -84.4722,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/books_yjqeh0.jpg',
    ],
  },
  {
    title: 'Family Board Games Collection',
    description:
      'Complete collection of family board games including Monopoly, Scrabble, Clue, and more. All games have all pieces and instructions. Perfect for family game nights.',
    category: 'Toys & Games',
    location: 'Fort Thomas',
    latitude: 39.0781,
    longitude: -84.4483,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/board-games_lmlfmh.jpg',
    ],
  },
  {
    title: 'Building Blocks Set',
    description:
      'Large set of colorful building blocks for creative play. Compatible with major brands. Great for developing motor skills and creativity. All pieces included.',
    category: 'Toys & Games',
    location: 'Florence',
    latitude: 38.9989,
    longitude: -84.6266,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/blocks-toy_c5ybnd.jpg',
    ],
  },
  {
    title: 'Acoustic Guitar - Yamaha',
    description:
      'Beautiful Yamaha acoustic guitar with rich sound. Perfect for beginners or intermediate players. Comes with case, tuner, and extra strings. Well-maintained.',
    category: 'Other',
    location: 'Burlington',
    latitude: 39.0276,
    longitude: -84.7241,
    images: [
      'https://res.cloudinary.com/drhfkyohi/image/upload/v1756059337/acoustic-guitar_m9m9b5.jpg',
    ],
  },
  {
    title: 'Mountain Bike - Trek',
    description:
      'Trek mountain bike in excellent condition. 21-speed, perfect for trails and city riding. Recently serviced with new tires and brakes. Helmet included.',
    category: 'Sports',
    location: 'Lawrenceburg',
    latitude: 39.0906,
    longitude: -84.8499,
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
