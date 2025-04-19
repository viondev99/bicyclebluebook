import images from 'assets/images';

export enum TypeFinderBike {
  Adult = 'Adult',
  Kids = 'Kids',
  Womens = 'Womens',
  Road = 'Road',
  Mountain = 'Mountain',
  Commuting = 'Commuting',
  Hybrid = 'Hybrid',
  GravelAndCyclocross = 'Gravel,Cyclocross',
}

export interface ItemTypeBike {
  name: TypeFinderBike;
  title: string;
  description: string;
  img: string;
}

export const TypeRiding: ItemTypeBike[] = [
  {
    name: TypeFinderBike.Road,
    title: 'Road Biking',
    description:
      'Whether you plan on racing for trophies or bragging rights on a group ride, you’re looking for something to get farther faster.',
    img: images.finderBike.imgRoadBikeType,
  },
  {
    name: TypeFinderBike.Mountain,
    title: 'Mountain Biking',
    description:
      'Escaping to the trails where you can test your fitness on the way up, then enjoy the rush on the way down.',
    img: images.finderBike.imgMountainBikeType,
  },
  {
    name: TypeFinderBike.Hybrid,
    title: 'Hybrid',
    description: "If you're looking to get to work, save gas, bypass traffic, or simply grabbing a cup of coffee.",
    img: images.finderBike.imgCommutingBikeType,
  },
  {
    name: TypeFinderBike.GravelAndCyclocross,
    title: 'Gravel / Cyclocross',
    description: "Go from paved roads to dirt trails. You're looking for adventure and you're not sure of the terrain.",
    img: images.finderBike.imgGravelBikeType,
  },
];
