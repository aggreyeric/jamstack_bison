import { extendType, objectType } from '@nexus/schema';
import { UserInputError, ForbiddenError } from 'apollo-server-micro';

import { isAdmin } from '../services/permissions';

// Book Type
export const Book = objectType({
  name: 'Book',
  description: 'A Book',
  definition(t) {
    t.id('id');
    t.string('title');
    t.string('content');
    t.string('url');
    t.string('image');
  },
});

// Enums
// export const CallPreference = enumType({
//   name: 'CallPreference',
//   members: ['WEEKDAY', 'WEEKEND', 'WEEKNIGHT'],
// });

// Queries
export const BookQueries = objectType({
  type: 'Query',
  definition: (t) => {
    // List Books Query (admin only)
    t.crud.books({
      filtering: true,
      ordering: true,
      // use resolve for permission checks or to remove fields
      resolve: async (root, args, ctx, info, originalResolve) => {
        if (!isAdmin(ctx.user)) throw new ForbiddenError('Unauthorized');

        return await originalResolve(root, args, ctx, info);
      },
    });

    // Custom Query
    t.field('me', {
      type: 'User',
      description: 'Returns the currently logged in user',
      nullable: true,
      resolve: (_root, _args, ctx) => ctx.user,
    });

    t.list.field('availabilityForUser', {
      type: 'Event',
      description: 'Returns available time slots to schedule calls with an expert',
    })
  },
});

// Mutations
export const BookMutations = extendType({
  type: 'Mutation',
  definition: (t) => {
  },
});
