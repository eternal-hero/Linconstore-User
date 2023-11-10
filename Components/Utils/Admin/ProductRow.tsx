import React, { useCallback, useContext, useEffect, useState } from "react";
import { TableCell, Button, TableRow, Switch, Autocomplete, TextField } from "@mui/material";
import { OpenInNew, Edit, CheckBox } from "@mui/icons-material";
import Truncate from "../../../Helpers/Truncate";
import { useTranslation } from "react-i18next";
import { getCurrencySymbol } from "../../../Helpers/Exchange";
import slug from "slug";
import { useAdminUpdateProductCategory } from "../../../hooks/useDataFetch";

interface IProducts {
  data: any;
  row: any;
  editId: string;
  isEditing: boolean;
  categories: string[];
  setEditId: (id: string) => void;
  handleChange: (id: string) => void;
  setIsEditing: (edit: boolean) => void;
}
const ProductRow: React.FC<IProducts> = ({ data, row, handleChange, isEditing, categories, setIsEditing, editId, setEditId }) => {
  const { t } = useTranslation();
  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState(row?.category.title);
  const [subCategory, setSubCategory] = useState(row?.subcategory);

  const handleEdit = () => {
    setIsEditing(true)
    setEditId(row._id)
  }

  const onSuccess = (data: any) => {
    setIsEditing(false)
    setEditId("")
  };

  const { isLoading: updating, mutate: updateProduct } = useAdminUpdateProductCategory(
    row._id,
    onSuccess
  );

  const handleSave = () => {
    const newData = {
      category: category,
      subcategory: subCategory
    };
    updateProduct(newData)
  }

  useEffect(() => {
    const filterCategory = data?.filter(
      (categori) => categori.title === category
    );
    if (filterCategory?.length > 0) {
      setSubCategories(
        filterCategory[0].subcategories.map(
          (subcategory) => `${category}.${subcategory}`
        )
      );
    }
  }, [category]);

  useEffect(() => {
    if (row) {
      setCategory(row?.category.title);
      setSubCategory(row?.subcategory);
    }
  }, [row]);

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {row.owner.name}
      </TableCell>
      <TableCell>
        {Truncate(row.title, 40)}
      </TableCell>
      <TableCell align="right">

        {editId == row._id && isEditing ?
          <Autocomplete
            id="cats-options"
            fullWidth
            options={categories}
            value={category}
            getOptionLabel={(cat) => (cat && t(`maincategory.${cat}`))}
            renderInput={(params) => (
              <TextField
                sx={{
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  bgcolor: "white",
                  mt: 2,
                }}
                {...params}
                value={categories[0]}
                variant="outlined"
                required
                fullWidth
                label={t("seller.post.add_product.category_field")}
                placeholder={t(
                  "seller.post.add_product.category_field_placeholder"
                )}
              />
            )}
            onChange={(e, data) => {
              setCategory(data)
            }}
          />
          : category}
      </TableCell>
      <TableCell align="right">
        {editId == row._id && isEditing ?
          <Autocomplete
            id="sub categories"
            fullWidth
            value={subCategory}
            options={subCategories}
            getOptionLabel={(cat) => cat && t(`subcategory.${cat}`)}
            noOptionsText={t("subcategory.no_options")}
            renderInput={(params) => (
              <TextField
                sx={{
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                  bgcolor: "white",
                  mt: 2,
                }}
                {...params}
                value={subCategories[0]}
                variant="outlined"
                required
                fullWidth
                label={t("seller.post.add_product.sub_category")}
                placeholder={t(
                  "seller.post.add_product.sub_category_placeholder"
                )}
              />
            )}
            onChange={(e, data) => setSubCategory(data)} />
          : subCategory.replace(category + ".", "")}
      </TableCell>

      <TableCell align="right">
        {editId == row._id && isEditing ?
          <Button sx={{ mt: 2 }} fullWidth onClick={handleSave}>
            <CheckBox />
          </Button>
          :
          <Button sx={{ mt: 2 }} fullWidth onClick={handleEdit}>
            <Edit />
          </Button>
        }
      </TableCell>
      <TableCell align="right">
        {getCurrencySymbol(row.owner.currency)} {row.price}
      </TableCell>
      <TableCell align="right" sx={{ cursor: "pointer" }}>
        <a target="_blank" rel="terms_link" href={`/product/${slug(row.title)}-${row._id}`}>
          <OpenInNew />
        </a>
      </TableCell>
      <TableCell align="right">
        <Switch
          onChange={() => handleChange(row._id)}
          checked={row.publish}
        />
      </TableCell>
    </TableRow>
  );
};
export default ProductRow;
