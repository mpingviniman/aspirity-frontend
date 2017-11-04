import fetch from 'isomorphic-fetch';

export default async() => {
  try {
    let response = await fetch('http://37.139.19.218:4000/api');
    let todos = await response.json();
    return todos;
  } catch (error) {
    console.log(error);
    return [];
  }
};
