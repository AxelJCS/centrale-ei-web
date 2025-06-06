import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      generated: true,
        primary : true,
        type: Number
    },
    type : {
      type : String, nullable: true 
    },
    title: {
      type: String
    },
    year: {
      type: String, nullable : true
    },
    overview: { type: 'text',nullable: true },

    poster_path: { type: 'varchar',nullable: true },

    genre_ids: {type: 'simple-array',nullable: true},

    vote_average: { type: 'float',nullable: true}
  },
});

export default User;

