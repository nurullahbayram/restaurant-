package com.restaurant.service;

import com.restaurant.model.Ingredient;
import com.restaurant.model.Menu;
import com.restaurant.output.MenuOutput;
import com.restaurant.repository.IngredientRepository;
import com.restaurant.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MenuServiceImpl implements MenuService {

    private MenuRepository menuRepository;

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    public MenuServiceImpl(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }


    @Override
    public Iterable<Menu> findAll() {
        Iterable<Menu> menu = menuRepository.findAll();
        return menu;
    }

    @Override
    public Menu createMenu(Menu menu) {
        Menu menuCreated;
        if (menu.getId() != null) {
            List<Ingredient> ingredientList = ingredientRepository.getIngredientsByMenuId(menu.getId());
            menuCreated = menuRepository.save(menu);
            for (Ingredient ingList : ingredientList) {
                ingredientRepository.saveMenuIdIntoIngredient(menu.getId(), ingList.getId());
            }
        } else {
           if(findByMenuName(menu.getMenuName()).isEmpty()) {
               System.out.println("");
               menuCreated = menuRepository.save(menu);
            }else{
               menuCreated=null;
               System.out.println("Same Menuname");
           }
        }
        return menuCreated;
    }

    @Override
    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }

    @Override
    public void uploadPictureToMenu(String imagePath, Long id) {
        menuRepository.uploadPictureToMenu(imagePath, id);
    }


    @Override
    public Optional<Menu> findById(Long id) {
        Optional<Menu> menu = menuRepository.findById(id);
        return menu;
    }

    @Override
    public List<MenuOutput> findByMenuTypeLike(String menuType) {

        List<Menu> menuList = menuRepository.findByMenuTypeLike(menuType);
        List<MenuOutput> menuOutput = new ArrayList<>();

        for(Menu menu:menuList){
            String productList = "";
            for(Ingredient ing : menu.getIngredients()){
                productList = productList+", "+ing.getproduct().getProductName();
                System.out.println(productList);
            }
            if(productList.length()>=1)productList=productList.substring(1);
            menuOutput.add(new MenuOutput(
                            menu.getId(),
                            menu.getMenuName(),
                            menu.getMenuType(),
                            menu.getImagePath(),
                            productList  )
            );
        }

        /*List<MenuOutput> menuOutput;
        menuOutput = menuList.stream().map(p ->
                new MenuOutput(p.getId(),
                        p.getMenuName(),
                        p.getMenuType(),
                        p.getImagePath(),
                        p.getIngredients().stream().
                                map(t -> t.getproduct().getProductName()).collect(Collectors.joining(","))
                )
        ).collect(Collectors.toList());
        //productList = String.join(",", menuOutput.toString());
        System.out.println(menuOutput.toString());*/
        return menuOutput;
    }

    @Override
    public Optional<Menu> findByMenuName(String menuName) {
        Optional<Menu> menu = menuRepository.findByMenuName(menuName);
        return menu;
    }


}
