import { Avatar, ListItem } from "@rneui/base";

const CustomListItem = ({ id, chatName }) => {
  return (
    <ListItem>
      <Avatar rounded source={{ uri: "https://i.pravatar.cc/300" }} />
      <ListItem.Content>
        <ListItem.Title>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          porro pariatur culpa provident maiores autem tempora impedit
          repellendus explicabo nobis, officiis laboriosam inventore. Vitae
          quibusdam sint est possimus, modi magni.
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;
