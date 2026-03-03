import prisma from "../prisma-client/client.js";

// READ - All users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs." });
  }
};

// READ - One user only
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user)
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l’utilisateur." });
  }
};

// CREATE - Create a user
export const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erreur createUser:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l’utilisateur." });
  }
};

// UPDATE - Edit a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    res.json(updated);
  } catch (error) {
    console.error("Erreur updateUser:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l’utilisateur." });
  }
};

// DELETE - Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur deleteUser:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l’utilisateur." });
  }
};
